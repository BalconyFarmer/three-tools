<template>
    <div id="leftContainer" @click="clearMeshSelection">
        <div id="leftToolClassSub">
            <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                highlight-current
                node-key="key"
                show-checkbox
                @node-click="handleNodeSelect"
                @check-change="handleCheckChange"
                @node-expand="handleNodeExpand"
            />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            treeData: [],
            selectedMeshUUID: null,
            defaultProps: {
                children: 'children',
                label: 'title'
            }
        }
    },
    watch: {
        checkedKeys(val) {
            console.log('Checked Keys:', val);
        },
    },
    methods: {
        handleNodeExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        handleCheckChange(checkedKeys) {
            this.checkedKeys = checkedKeys;
        },
        handleNodeSelect(node) {
            window.app3D.getMeshByUUID(node.key);
            this.selectedKeys = [node.key];
        },
        updateTreeData() {
            setTimeout(() => {
                this.treeData = window.app3D.getSceneChildren();
            }, 500);
        },
        clearMeshSelection() {
            window.app3D.clearSelectedMesh();
            this.selectedKeys = [];
        }
    },
    mounted() {
        setTimeout(() => {
            this.treeData = window.app3D.getSceneChildren();
            window.app3D.eventBus.addEventListener('updateTreeData', this.updateTreeData);
        }, 500);
    },
    beforeDestroy() {
        window.app3D.eventBus.removeEventListener('updateTreeData', this.updateTreeData);
    }
};
</script>

<style lang="scss">
#leftContainer {
    position: absolute;
    left: 0px;
    top: 46px;
    overflow: auto;
    width: 300px;
    height: calc(100vh - 46px);
    border: solid #99A1A9 1px;
    background-color: transparent;

    #leftToolClassSub {
        display: inline;
        float: left;
        margin-left: 2px;
        width: 100%;
        height: calc(100vh - 46px);

        #leftSubMenu {
            position: absolute;
            left: 100px;
            height: 100px;
        }

        .el-tree {
            background-color: transparent;
            color: #ecf0f1;
            width: 100%;

            .el-tree-node__label {
                color: #ecf0f1;
            }

            .el-tree-node__content {
                background-color: transparent !important;
            }

            .el-tree-node.is-current .el-tree-node__content {
                background-color: #3498db !important;
            }
        }
    }
}
</style>
