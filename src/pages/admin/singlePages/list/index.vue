<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    v-if="show"
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    v-if="show"
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small">编辑{{scope.row.multi[0]}}</el-button>
                    <br>
                    <el-button size="small" type="danger">删除{{scope.row.multi[1]}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作2">
                <template scope="scope">
                    <el-row>
                        <el-button size="small">编辑</el-button>
                    </el-row>
                    <el-row>
                        <el-button size="small" type="danger">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="less"
       rel="stylesheet/less"
       scoped>
    body{
        background: red;
    }
</style>
<script>
    export default{
        data(){
            return{
                show:false,
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    multi:['目标作物','目标地区']
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    multi:['目标作物1','目标地区1']
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    multi:['目标作物2','目标地区2']
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    multi:['目标作物3','目标地区3']
                }]
            }
        },
        components:{
        }
    }
</script>
