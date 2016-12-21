var proxyAddress = '';

module.exports = {
    '/api/form': function (req, res) {
        res.send({
                "name": "dsadsd",
                "region": "beijing",
                "date1": "2016-12-20T16:00:00.000Z",
                "date2": "2016-12-18T08:18:05.747Z",
                "delivery": true,
                "type": ["美食/餐厅线上活动", "单纯品牌曝光"],
                "resource": "线上品牌商赞助",
                "desc": "dsddsds"
            }
        )
    }
}
