<template>
    <div class="formWrap">
        <div ref="content"
             v-map=""></div>
    </div>
</template>
<style lang="less"
       rel="stylesheet/less"
       scoped>
    .formWrap {
        margin-top: 30px;
        width: 100%;
        height: 800px;
    }
</style>
<script>
    import axios from 'axios'
    export default{
        data() {
            return {}
        },
        directives: {
            map: {
                bind(el){
                    var result = {};
                    var defineUrl = function (layerType) {
                        var urlArr = [];
                        for (var i = 0; i < 8; i++) {
                            var url = "http://t" + i + ".tianditu.com/DataServer?T=" + layerType + "_w&x={x}&y={y}&l={z}";
                            urlArr.push(url);
                        }
                        return urlArr;
                    }

                    result.tdtVecLayer = new ol.layer.Tile({
                        title: "矢量数据",
                        source: new ol.source.XYZ({
                            urls: defineUrl("vec")
                        })
                    });

                    result.tdtImgLayer = new ol.layer.Tile({
                        visible: false,
                        title: "影像数据",
                        source: new ol.source.XYZ({
                            urls: defineUrl("img")
                        })
                    });

                    result.tdtCvaLayer = new ol.layer.Tile({
                        title: "文字注记",
                        source: new ol.source.XYZ({
                            urls: defineUrl("cva")
                        })
                    });

                    result.map = new ol.Map({
                        target: el,
                        layers: [result.tdtVecLayer, result.tdtImgLayer, result.tdtCvaLayer],
                        controls: ol.control.defaults().extend([
                            new ol.control.ScaleLine({
                                target: document.getElementById('scaleline')
                            }),
                            new ol.control.MousePosition({
                                coordinateFormat: ol.coordinate.toStringHDMS,
                                projection: 'EPSG:4326'
                            })
                        ]),
                        view: new ol.View({
                            center: ol.proj.fromLonLat([104.48, 39.85]),
                            zoom: 4,
                            minZoom: 2,
                            maxZoom: 18
                        })
                    });

                    // set the annotation layer on the topest
                    result.tdtCvaLayer.setZIndex(5);
                },
                unbind(){

                },
                update(){

                }
            }
        },
        methods: {
            onSubmit() {
                debugger
                alert('submit!');
            },
            onCancel(){
                alert('cancel');
            }
        },
        watch: {
            $route: {
                handler: function ({query}) {
                },
                immediate: true
            }
        },
        components: {}
    }
</script>
