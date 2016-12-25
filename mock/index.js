var proxyAddress = '';

module.exports = {
    '/home/navigate': function (req, res) {
        res.send([
            {
                "id": "1",
                "navigate_name": "业务管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "1",
                "privilege": "1",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "2",
                        "navigate_name": "业务监控统计",
                        "link_name": "Business_monitor\/statistics",
                        "parent_id": "1",
                        "display_order": "87",
                        "privilege": "2",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "3",
                "navigate_name": "后台用户管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "3",
                "privilege": "3",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "4",
                        "navigate_name": "后台用户列表",
                        "link_name": "Admin_user\/admin_user_list",
                        "parent_id": "3",
                        "display_order": "4",
                        "privilege": "4",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "6",
                        "navigate_name": "后台权限管理",
                        "link_name": "admin_user\/privilege_manage",
                        "parent_id": "3",
                        "display_order": "6",
                        "privilege": "6",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "7",
                "navigate_name": "前端用户管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "7",
                "privilege": "7",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "10",
                        "navigate_name": "终端用户首页个性化",
                        "link_name": "end_user\/mainpage_manager",
                        "parent_id": "7",
                        "display_order": "8",
                        "privilege": "10",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "8",
                        "navigate_name": "终端用户列表",
                        "link_name": "end_user\/end_user_list",
                        "parent_id": "7",
                        "display_order": "9",
                        "privilege": "8",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "9",
                        "navigate_name": "终端用户区划管理",
                        "link_name": "end_user\/area_manager",
                        "parent_id": "7",
                        "display_order": "10",
                        "privilege": "9",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "11",
                        "navigate_name": "终端用户长势旱情产品管理",
                        "link_name": "end_user\/product_manager",
                        "parent_id": "7",
                        "display_order": "11",
                        "privilege": "11",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "12",
                "navigate_name": "农情报告管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "12",
                "privilege": "12",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "15",
                        "navigate_name": "终端用户农情报告管理",
                        "link_name": "Report\/user_report_manager",
                        "parent_id": "12",
                        "display_order": "13",
                        "privilege": "15",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "14",
                        "navigate_name": "农情报告专题管理",
                        "link_name": "Report\/topic_browse",
                        "parent_id": "12",
                        "display_order": "14",
                        "privilege": "14",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "13",
                        "navigate_name": "农情报告浏览",
                        "link_name": "Report\/browse",
                        "parent_id": "12",
                        "display_order": "15",
                        "privilege": "13",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "70",
                        "navigate_name": "用户报告专题开通",
                        "link_name": "Report\/user_topic_add",
                        "parent_id": "12",
                        "display_order": "69",
                        "privilege": "70",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "16",
                "navigate_name": "长势旱情产品管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "16",
                "privilege": "16",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "17",
                        "navigate_name": "新建长势旱情产品",
                        "link_name": "remotesense_product\/create",
                        "parent_id": "16",
                        "display_order": "17",
                        "privilege": "17",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "78",
                        "navigate_name": "长势旱情产品编辑",
                        "link_name": "growth_drought\/gdp_edit",
                        "parent_id": "16",
                        "display_order": "76",
                        "privilege": "18",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "79",
                        "navigate_name": "长势旱情产品权限管理",
                        "link_name": "growth_drought\/gdp_authority",
                        "parent_id": "16",
                        "display_order": "78",
                        "privilege": "19",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "18",
                "navigate_name": "Modis生产监控",
                "link_name": "",
                "parent_id": "0",
                "display_order": "18",
                "privilege": "18",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "19",
                        "navigate_name": "原始数据下载情况",
                        "link_name": "Original\/down",
                        "parent_id": "18",
                        "display_order": "19",
                        "privilege": "19",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "21",
                        "navigate_name": "数据质量监控查询",
                        "link_name": "Data_quality\/inquire",
                        "parent_id": "18",
                        "display_order": "20",
                        "privilege": "21",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "20",
                        "navigate_name": "原始数据拷贝情况",
                        "link_name": "Original\/copy",
                        "parent_id": "18",
                        "display_order": "21",
                        "privilege": "20",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "22",
                        "navigate_name": "重建模块结果预览",
                        "link_name": "Growth_drought\/monitor",
                        "parent_id": "18",
                        "display_order": "22",
                        "privilege": "22",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "76",
                        "navigate_name": "Modis自动生产",
                        "link_name": "Modis\/modis_autoproduce",
                        "parent_id": "18",
                        "display_order": "75",
                        "privilege": "76",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "23",
                "navigate_name": "影像管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "23",
                "privilege": "23",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "24",
                        "navigate_name": "原始影像导入",
                        "link_name": "imagry\/origin_import",
                        "parent_id": "23",
                        "display_order": "24",
                        "privilege": "24",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "31",
                "navigate_name": "作物分布",
                "link_name": "",
                "parent_id": "0",
                "display_order": "31",
                "privilege": "31",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "37",
                        "navigate_name": "外部分类结果导入",
                        "link_name": "classification\/classification_deploy",
                        "parent_id": "31",
                        "display_order": "39",
                        "privilege": "73",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "73",
                        "navigate_name": "分类结果发布",
                        "link_name": "classification\/user_product",
                        "parent_id": "31",
                        "display_order": "41",
                        "privilege": "37",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "81",
                        "navigate_name": "用户分布产品授权",
                        "link_name": "classification\/cp_authorize",
                        "parent_id": "31",
                        "display_order": "70",
                        "privilege": "81",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "74",
                        "navigate_name": "分类结果发布过程监控",
                        "link_name": "classification\/classification_monitor",
                        "parent_id": "31",
                        "display_order": "71",
                        "privilege": "74",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "75",
                        "navigate_name": "动态监测产品管理",
                        "link_name": "classification\/classification_mgr",
                        "parent_id": "31",
                        "display_order": "77",
                        "privilege": "75",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "42",
                "navigate_name": "知识库",
                "link_name": "",
                "parent_id": "0",
                "display_order": "43",
                "privilege": "42",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "43",
                        "navigate_name": "气象数据",
                        "link_name": "library\/atmosphere",
                        "parent_id": "42",
                        "display_order": "44",
                        "privilege": "43",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "44",
                        "navigate_name": "土壤墒情",
                        "link_name": "library\/soil_moisture",
                        "parent_id": "42",
                        "display_order": "45",
                        "privilege": "44",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "55",
                "navigate_name": "基础数据管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "56",
                "privilege": "55",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "58",
                        "navigate_name": "区划管理",
                        "link_name": "basic_config\/basic_area_manager",
                        "parent_id": "55",
                        "display_order": "57",
                        "privilege": "58",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "57",
                        "navigate_name": "几何矫正基准影像管理",
                        "link_name": "basic_config\/standard_imagry_manager",
                        "parent_id": "55",
                        "display_order": "58",
                        "privilege": "57",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "56",
                        "navigate_name": "DEM数据管理",
                        "link_name": "basic_config",
                        "parent_id": "55",
                        "display_order": "59",
                        "privilege": "56",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "59",
                        "navigate_name": "系统投影标准",
                        "link_name": "basic_config\/projection_standard",
                        "parent_id": "55",
                        "display_order": "60",
                        "privilege": "59",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "60",
                "navigate_name": "系统维护",
                "link_name": "",
                "parent_id": "0",
                "display_order": "61",
                "privilege": "60",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "61",
                        "navigate_name": "自动服务",
                        "link_name": "Deploys\/deploy",
                        "parent_id": "60",
                        "display_order": "62",
                        "privilege": "61",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "62",
                "navigate_name": "市场信息管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "63",
                "privilege": "62",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "63",
                        "navigate_name": "市场信息资讯管理",
                        "link_name": "market_info\/news_add",
                        "parent_id": "62",
                        "display_order": "64",
                        "privilege": "63",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "77",
                        "navigate_name": "市场信息资讯浏览",
                        "link_name": "market_info\/market_news_delete",
                        "parent_id": "62",
                        "display_order": "74",
                        "privilege": "77",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "83",
                        "navigate_name": "用户市场信息作物权限管理",
                        "link_name": "market_info\/crop_permissions_manager",
                        "parent_id": "62",
                        "display_order": "79",
                        "privilege": "82",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "64",
                "navigate_name": "知识图谱管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "65",
                "privilege": "64",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "65",
                        "navigate_name": "分类名词录入",
                        "link_name": "data_analyze\/category_tag_record",
                        "parent_id": "64",
                        "display_order": "66",
                        "privilege": "65",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "69",
                        "navigate_name": "站点录入",
                        "link_name": "website_record\/site_entry",
                        "parent_id": "64",
                        "display_order": "67",
                        "privilege": "69",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "66",
                        "navigate_name": "分类名词统计分析",
                        "link_name": "data_analyze\/category_tag_browse",
                        "parent_id": "64",
                        "display_order": "68",
                        "privilege": "66",
                        "status": "1",
                        "is_generate": "1"
                    },
                    {
                        "id": "71",
                        "navigate_name": "站点统计分析",
                        "link_name": "website_record\/site_statistic",
                        "parent_id": "64",
                        "display_order": "72",
                        "privilege": "71",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "84",
                "navigate_name": "数据抓取分析",
                "link_name": "",
                "parent_id": "0",
                "display_order": "80",
                "privilege": "84",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "85",
                        "navigate_name": "原始数据浏览",
                        "link_name": "data_capture\/raw_data_browsing",
                        "parent_id": "84",
                        "display_order": "81",
                        "privilege": "85",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            },
            {
                "id": "86",
                "navigate_name": "菜单管理",
                "link_name": "",
                "parent_id": "0",
                "display_order": "82",
                "privilege": "86",
                "status": "1",
                "is_generate": "1",
                "children": [
                    {
                        "id": "88",
                        "navigate_name": "菜单列表",
                        "link_name": "menu\/menu_list",
                        "parent_id": "86",
                        "display_order": "84",
                        "privilege": "88",
                        "status": "1",
                        "is_generate": "1"
                    }
                ]
            }
        ]);
    },
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
    },
    '/front/user/isLogin': function (req, res) {
        res.send([
                {
                    is_login: true,
                    username: 'kukuv'
                }
            ]
        )
    }
}
