import * as THREE from "three";

/**
 * 模拟草地
 */
export class Grass {
    constructor(app) {
        this.app = app;
    }

    add() {
        const self = this;
        const width = 120;
        const resolution = 64;
        const delta = width / resolution;
        const radius = 240;
        const bladeHeight = 1;
        const joints = 4;
        const bladeWidth = 0.12;
        const instances = 40000;
        const azimuth = 0.4;
        const elevation = 0.2;

        const ambientStrength = 0.7;
        const translucencyStrength = 1.5;
        const specularStrength = 0.5;
        const diffuseStrength = 1.5;
        const shininess = 256;
        const sunColour = new THREE.Vector3(1.0, 1.0, 1.0);
        const specularColour = new THREE.Vector3(1.0, 1.0, 1.0);

        const loader = new THREE.TextureLoader();
        loader.crossOrigin = '';
        const grassTexture = loader.load('https://al-ro.github.io/images/grass/blade_diffuse.jpg');
        const alphaMap = loader.load('https://al-ro.github.io/images/grass/blade_alpha.jpg');
        const noiseTexture = loader.load('https://al-ro.github.io/images/grass/perlinFbm.jpg');
        noiseTexture.wrapS = THREE.RepeatWrapping;
        noiseTexture.wrapT = THREE.RepeatWrapping;

        const groundBaseGeometry = new THREE.PlaneGeometry(width, width, resolution, resolution);
        groundBaseGeometry.lookAt(new THREE.Vector3(0, 1, 0));
        groundBaseGeometry.verticesNeedUpdate = true;

        const groundGeometry = new THREE.PlaneGeometry(width, width, resolution, resolution);
        groundGeometry.setAttribute('basePosition', groundBaseGeometry.getAttribute("position"));
        groundGeometry.lookAt(new THREE.Vector3(0, 1, 0));
        groundGeometry.verticesNeedUpdate = true;
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x000900 });

        const sharedPrefix = `
        uniform sampler2D noiseTexture;
        float getYPosition(vec2 p){
            return 8.0*(2.0*texture2D(noiseTexture, p/800.0).r - 1.0);
        }
        `;

        const groundVertexPrefix = sharedPrefix + `
attribute vec3 basePosition;
uniform float delta;
uniform float posX;
uniform float posZ;
uniform float radius;
uniform float width;

float placeOnSphere(vec3 v){
  float theta = acos(v.z/radius);
  float phi = acos(v.x/(radius * sin(theta)));
  float sV = radius * sin(theta) * sin(phi);
  //If undefined, set to default value
  if(sV != sV){
    sV = v.y;
  }
  return sV;
}

//Get the position of the ground from the [x,z] coordinates, the sphere and the noise height field
vec3 getPosition(vec3 pos, float epsX, float epsZ){
  vec3 temp;
  temp.x = pos.x + epsX;
  temp.z = pos.z + epsZ;
  temp.y = max(0.0, placeOnSphere(temp)) - radius;
  temp.y += getYPosition(vec2(basePosition.x+epsX+delta*floor(posX), basePosition.z+epsZ+delta*floor(posZ)));
  return temp;
}

//Find the normal at pos as the cross product of the central-differences in x and z directions
vec3 getNormal(vec3 pos){
  float eps = 1e-1;

  vec3 tempP = getPosition(pos, eps, 0.0);
  vec3 tempN = getPosition(pos, -eps, 0.0);

  vec3 slopeX = tempP - tempN;

  tempP = getPosition(pos, 0.0, eps);
  tempN = getPosition(pos, 0.0, -eps);

  vec3 slopeZ = tempP - tempN;

  vec3 norm = normalize(cross(slopeZ, slopeX));
  return norm;
}
`;

        groundMaterial.onBeforeCompile = function (shader) {
            shader.uniforms.delta = { value: delta };
            shader.uniforms.posX = { value: 0.01 };
            shader.uniforms.posZ = { value: 0.01 };
            shader.uniforms.radius = { value: radius };
            shader.uniforms.width = { value: width };
            shader.uniforms.noiseTexture = { value: noiseTexture };
            shader.vertexShader = groundVertexPrefix + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <beginnormal_vertex>',
                `vec3 pos = vec3(0);
                  pos.x = basePosition.x - mod(mod((delta*posX),delta) + delta, delta);
                  pos.z = basePosition.z - mod(mod((delta*posZ),delta) + delta, delta);
                  pos.y = max(0.0, placeOnSphere(pos)) - radius;
                  pos.y += getYPosition(vec2(basePosition.x+delta*floor(posX), basePosition.z+delta*floor(posZ)));
                  vec3 objectNormal = getNormal(pos);
            #ifdef USE_TANGENT
                  vec3 objectTangent = vec3( tangent.xyz );
            #endif`
            );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `vec3 transformed = vec3(pos);`
            );
        };

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.geometry.computeVertexNormals();
        this.app.scene.add(ground);

        //************** Grass **************
        const grassVertexSource = sharedPrefix + `
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec2 uv;
attribute vec2 halfRootAngle;
attribute float scale;
attribute float index;
uniform float time;

uniform float delta;
uniform float posX;
uniform float posZ;
uniform float radius;
uniform float width;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float frc;
varying float idx;

const float PI = 3.1415;
const float TWO_PI = 2.0 * PI;

vec3 rotateVectorByQuaternion(vec3 v, vec4 q){
  return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
}

float placeOnSphere(vec3 v){
  float theta = acos(v.z/radius);
  float phi = acos(v.x/(radius * sin(theta)));
  float sV = radius * sin(theta) * sin(phi);
  if(sV != sV){
    sV = v.y;
  }
  return sV;
}

void main() {

	frc = position.y / float(` + bladeHeight + `);

  vec3 vPosition = position;
	vPosition.y *= scale;

	vNormal = normal;
	vNormal.y /= scale;

  vec4 direction = vec4(0.0, halfRootAngle.x, 0.0, halfRootAngle.y);
	vPosition = rotateVectorByQuaternion(vPosition, direction);
	vNormal = rotateVectorByQuaternion(vNormal, direction);

  vUv = uv;

	vec3 pos;
	vec3 globalPos;
	vec3 tile;

	globalPos.x = offset.x-posX*delta;
	globalPos.z = offset.z-posZ*delta;

	tile.x = floor((globalPos.x + 0.5 * width) / width);
	tile.z = floor((globalPos.z + 0.5 * width) / width);

	pos.x = globalPos.x - tile.x * width;
	pos.z = globalPos.z - tile.z * width;

	pos.y = max(0.0, placeOnSphere(pos)) - radius;
	pos.y += getYPosition(vec2(pos.x+delta*posX, pos.z+delta*posZ));

  vec2 fractionalPos = 0.5 + offset.xz / width;
  fractionalPos *= TWO_PI;

  float noise = sin(fractionalPos.x + time);
  float halfAngle = noise * 0.1;
  noise = 0.5 + 0.5 * cos(fractionalPos.y + 0.25 * time);
  halfAngle -= noise * 0.2;

	direction = normalize(vec4(sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle)));

  vPosition = rotateVectorByQuaternion(vPosition, direction);
	vNormal = rotateVectorByQuaternion(vNormal, direction);

	vPosition += pos;

	idx = index;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

}`;

        const grassFragmentSource = `
precision mediump float;

uniform vec3 cameraPosition;
uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float translucencyStrength;
uniform float shininess;
uniform vec3 lightColour;
uniform vec3 sunDirection;
uniform sampler2D map;
uniform sampler2D alphaMap;
uniform vec3 specularColour;

varying float frc;
varying float idx;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 ACESFilm(vec3 x){
	float a = 2.51;
	float b = 0.03;
	float c = 2.43;
	float d = 0.59;
	float e = 0.14;
	return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

void main() {

  if(texture2D(alphaMap, vUv).r < 0.15){
    discard;
  }

	vec3 normal;

	if(gl_FrontFacing){
		normal = normalize(vNormal);
	}else{
		normal = normalize(-vNormal);
	}

	vec3 textureColour = pow(texture2D(map, vUv).rgb, vec3(2.2));

	vec3 mixColour = idx > 0.75 ? vec3(0.07, 0.52, 0.06) : vec3(0.07, 0.43, 0.08);
  textureColour = mix(pow(mixColour, vec3(2.2)), textureColour, frc);

	vec3 lightTimesTexture = lightColour * textureColour;
  vec3 ambient = textureColour;
	vec3 lightDir = normalize(sunDirection);

	float dotNormalLight = dot(normal, lightDir);
  float diff = max(dotNormalLight, 0.0);

  vec3 diffuse = diff * lightTimesTexture;

  float sky = max(dot(normal, vec3(0,1,0)), 0.0);
	vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

  vec3 viewDirection = normalize(cameraPosition - vPosition);
  vec3 halfwayDir = normalize(lightDir + viewDirection);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);

  vec3 specular = spec * specularColour * lightColour;

	vec3 diffuseTranslucency = vec3(0);
	vec3 forwardTranslucency = vec3(0);
	float dotViewLight = dot(-lightDir, viewDirection);
	if(dotNormalLight <= 0.0){
		diffuseTranslucency = lightTimesTexture * translucencyStrength * -dotNormalLight;
		if(dotViewLight > 0.0){
			forwardTranslucency = lightTimesTexture * translucencyStrength * pow(dotViewLight, 16.0);
		}
	}

  vec3 col = 0.3 * skyLight * textureColour + ambientStrength * ambient + diffuseStrength * diffuse + specularStrength * specular + diffuseTranslucency + forwardTranslucency;

  col = ACESFilm(col);

	col = pow(col, vec3(0.4545));

	col = mix(vec3(0.0, 0.2, 0.0), col, frc);

  gl_FragColor = vec4(col, 1.0);
}`;

        const grassBaseGeometry = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
        grassBaseGeometry.translate(0, bladeHeight / 2, 0);

        const vertex = new THREE.Vector3();
        const quaternion0 = new THREE.Quaternion();
        const quaternion1 = new THREE.Quaternion();
        let x, angle, sinAngle, rotationAxis;

        // Rotate around Y
        angle = 0.05;
        sinAngle = Math.sin(angle / 2.0);
        rotationAxis = new THREE.Vector3(0, 1, 0);
        x = rotationAxis.x * sinAngle;
        let y = rotationAxis.y * sinAngle;
        let z = rotationAxis.z * sinAngle;
        let w = Math.cos(angle / 2.0);
        quaternion0.set(x, y, z, w);

        // Rotate around X
        angle = 0.3;
        sinAngle = Math.sin(angle / 2.0);
        rotationAxis.set(1, 0, 0);
        x = rotationAxis.x * sinAngle;
        y = rotationAxis.y * sinAngle;
        z = rotationAxis.z * sinAngle;
        w = Math.cos(angle / 2.0);
        quaternion1.set(x, y, z, w);

        quaternion0.multiply(quaternion1);

        angle = 0.1;
        sinAngle = Math.sin(angle / 2.0);
        rotationAxis.set(0, 0, 1);
        x = rotationAxis.x * sinAngle;
        y = rotationAxis.y * sinAngle;
        z = rotationAxis.z * sinAngle;
        w = Math.cos(angle / 2.0);
        quaternion1.set(x, y, z, w);

        quaternion0.multiply(quaternion1);

        const quaternion2 = new THREE.Quaternion();

        for (let v = 0; v < grassBaseGeometry.attributes.position.array.length; v += 3) {
            quaternion2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            vertex.x = grassBaseGeometry.attributes.position.array[v];
            vertex.y = grassBaseGeometry.attributes.position.array[v + 1];
            vertex.z = grassBaseGeometry.attributes.position.array[v + 2];
            const frac = vertex.y / bladeHeight;
            quaternion2.slerp(quaternion0, frac);
            vertex.applyQuaternion(quaternion2);
            grassBaseGeometry.attributes.position.array[v] = vertex.x;
            grassBaseGeometry.attributes.position.array[v + 1] = vertex.y;
            grassBaseGeometry.attributes.position.array[v + 2] = vertex.z;
        }

        grassBaseGeometry.computeVertexNormals();

        const instancedGeometry = new THREE.InstancedBufferGeometry();
        instancedGeometry.index = grassBaseGeometry.index;
        instancedGeometry.attributes.position = grassBaseGeometry.attributes.position;
        instancedGeometry.attributes.uv = grassBaseGeometry.attributes.uv;
        instancedGeometry.attributes.normal = grassBaseGeometry.attributes.normal;
        const indices = [];
        const offsets = [];
        const scales = [];
        const halfRootAngles = [];

        for (let i = 0; i < instances; i++) {

            indices.push(i / instances);

            x = Math.random() * width - width / 2;
            const z = Math.random() * width - width / 2;
            const y = 0;
            offsets.push(x, y, z);

            const angle = Math.PI - Math.random() * (2 * Math.PI);
            halfRootAngles.push(Math.sin(0.5 * angle), Math.cos(0.5 * angle));

            if (i % 3 != 0) {
                scales.push(2.0 + Math.random() * 1.25);
            } else {
                scales.push(2.0 + Math.random());
            }
        }

        const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3);
        const scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(scales), 1);
        const halfRootAngleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(halfRootAngles), 2);
        const indexAttribute = new THREE.InstancedBufferAttribute(new Float32Array(indices), 1);

        instancedGeometry.setAttribute('offset', offsetAttribute);
        instancedGeometry.setAttribute('scale', scaleAttribute);
        instancedGeometry.setAttribute('halfRootAngle', halfRootAngleAttribute);
        instancedGeometry.setAttribute('index', indexAttribute);

        const grassMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                time: { type: 'float', value: 0 },
                delta: { type: 'float', value: delta },
                posX: { type: 'float', value: 0.01 },
                posZ: { type: 'float', value: 0.01 },
                radius: { type: 'float', value: radius },
                width: { type: 'float', value: width },
                map: { value: grassTexture },
                alphaMap: { value: alphaMap },
                noiseTexture: { value: noiseTexture },
                sunDirection: {
                    type: 'vec3',
                    value: new THREE.Vector3(Math.sin(azimuth), Math.sin(elevation), -Math.cos(azimuth))
                },
                cameraPosition: { type: 'vec3', value: this.app.camera.position },
                ambientStrength: { type: 'float', value: ambientStrength },
                translucencyStrength: { type: 'float', value: translucencyStrength },
                diffuseStrength: { type: 'float', value: diffuseStrength },
                specularStrength: { type: 'float', value: specularStrength },
                shininess: { type: 'float', value: shininess },
                lightColour: { type: 'vec3', value: sunColour },
                specularColour: { type: 'vec3', value: specularColour },
            },
            vertexShader: grassVertexSource,
            fragmentShader: grassFragmentSource,
            side: THREE.DoubleSide
        });

        const grass = new THREE.Mesh(instancedGeometry, grassMaterial);
        this.app.scene.add(grass);
        grass.scale.set(0.4, 0.4, 0.4);
        grass.position.set(54, 6, -48);

        let time = 0;
        let lastFrame = Date.now();
        let thisFrame;
        let dT = 0;

        function draw() {
            thisFrame = Date.now();
            dT = (thisFrame - lastFrame) / 200.0;
            time += dT;
            lastFrame = thisFrame;

            grassMaterial.uniforms.time.value = time;

            self.app.renderer.clear();
            self.app.renderer.render(self.app.scene, self.app.camera);

            requestAnimationFrame(draw);
        }

        draw();
    }
}
