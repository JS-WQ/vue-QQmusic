<template>
    <div class="search-ct">
        <img class='logo' src="../../components/images/搜索.png">
        <input class="insearch" type="text" :placeholder="placeholder" v-model="searchQuery">
        <img class="logo" v-show="searchQuery" src="../../components/images/删除 (1).png" @click="delet">
    </div>
</template>

<script>
export default {
data () {
    return {
        searchQuery:''
    };
},
computed: {},
methods: {
    delet(){
        this.searchQuery = ''
    },
    setQuery(query){
        this.searchQuery = query
    }
},
created(){
    this.$watch('searchQuery',(newquery)=>{
        this.$emit('searchQuery',newquery)
    })
},
props:['placeholder']
}
</script>
<style lang='scss' scoped>
    .search-ct{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px 4px;
        .logo{
            width: 24px;
            height: 24px;
        }
        .insearch{
            border: none;
            outline: none;
            padding: 6px 0;
            background: transparent;
            margin-left: 4px;
            flex: 1;
        }
    }
</style>