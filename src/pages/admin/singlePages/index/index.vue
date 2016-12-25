<template>
    <div>
        <div>这是主页</div>
    </div>
</template>
<style></style>
<script>
    import axios from 'axios'
    export default{
        data(){
            return {
                layout: 'list',
                article: [
                    {
                        title: 'aa'
                    }, {
                        title: 'bb'
                    }
                ]
            }
        },
        mounted(){
            axios.get('/home/navigate')
                 .then((response) => {
                             console.log(response.data)
                             debugger;
                         }
                 )
                 .catch(function (error) {
                             debugger;
                             console.log(error);
                         }
                 );
        },
        components: {}
    }
</script>
