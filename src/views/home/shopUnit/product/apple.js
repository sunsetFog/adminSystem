export default {
    data () {
        return {
            product_category_list: [],
            defaultProps: {// 替换结构字段，不用处理数据
                children: 'children',
                value: 'id',
                label: 'name'
            },
            brand_list: []
        }
    },
    created () {
        this.categoryWay();
        this.brandWay();
    },
    methods: {
        // 商品分类
        categoryWay() {
            let that = this;
            let params = {
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/productCategory/treeList',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.product_category_list = res.data;
                        for (let i = 0; i < that.product_category_list.length; i++) {
                            let item = that.product_category_list[i];
                            for (let y = 0; y < item.children.length; y++) {
                                let element = item.children[y];
                                delete element["children"];
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 商品品牌
        brandWay() {
            let that = this;
            let params = {
                keyword: '',
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/brand/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.brand_list = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        }
    }
}