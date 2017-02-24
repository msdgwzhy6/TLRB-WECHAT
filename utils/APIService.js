
const URL = 'https://api.bmob.cn/';

var app = getApp();


function getHeader(){
  var account = app.globalData.userInfo;
  var header = {
     'content-type':'application/json',
     'X-Bmob-Application-Id':'c1aa552ec6d7639a92f11a362ff22b34',
     'X-Bmob-REST-API-Key':'a93c8e5501c9f2ed942ae1cff46ccd77',
     'X-Bmob-Session-Token':app.globalData.token
  }
  return header;
}

function register(userInfo){//注册
    console.log(userInfo);
    wx.request({
      url: URL+'1/users',
      data: {
          'nickname':'测试',
          'type':4,
          'username':'test',
          'password':'123456'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
          'content-type':'application/json',
          'X-Bmob-Application-Id':'c1aa552ec6d7639a92f11a362ff22b34',
          'X-Bmob-REST-API-Key':'a93c8e5501c9f2ed942ae1cff46ccd77'
      }, 
      success: function(res){
        // success
        console.log("success"+res);
      },
      fail: function(e) {
        // fail
        console.log("fail "+e);
      },
      complete: function() {
        console.log("complete");
      }
    })
}

function login(username,password,cb){//登录
    var header = getHeader();
    wx.request({
      url: URL+'1/login',//?username='+username+'&password='+password,
      data:{
        username:username,
        password:password
      },
      dataType:'json',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: header,// 设置请求的 header
      success: function(res){
        // success
        console.log(res);
        if(cb){
          cb(res);
        }
      },
      fail: function(e) {
        // fail
        console.log(e);
        if(cb){
          cb(null);
        }
      },
      complete: function() {
        // complete
        console.log("complete");
      }
    })
}

function getRedBomList(type,page,size,cb){//获取红包列表
  var header = getHeader();
  var where = {
    userName:"test",
    isDelete:false,
    type:type,
  };
  var whereJson = JSON.stringify(where);
  var skip = size * (page-1);
  wx.request({
    url: URL+'1/classes/RedBomb',
    data: {
      where:whereJson,
      skip:skip,
      size:size,
      order:"-createdAt"
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, // 设置请求的 header
    success: function(res){
      // success
      console.log(res);
      cb(res.data.results)
    },
    fail: function() {
      // fail
      console.log("fail");
    },
    complete: function() {
      // complete
    }
  })
}

function addRedBomb(redBomb,cb){//添加红包信息
  var header = getHeader();
  var acl={};
  acl[account.objectId]={"write":true,"read":true};
  console.log(acl);
  redBomb['ACL'] = acl;
  redBomb['userName'] = account.username;
  redBomb['isDelete'] = false;
  redBomb['target'] = 3;
  var location = app.globalData.location;
  if(location != null){
    redBomb['province'] = location.province;
    redBomb['city'] = location.city;
    redBomb['district'] = location.district;
    redBomb['location'] = {
      'latitude':location.latitude,
      'longitude':location.longitude,
      '__type':'GeoPoint'
    }
  }
  console.log(redBomb);
  wx.request({
    url: URL+'1/classes/RedBomb',
    data: redBomb,
    dataType:'json',
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, // 设置请求的 header
    success: function(res){
      // success
      console.log(res);
      if(cb){
        cb(true)
      }
    },
    fail: function() {
      // fail
      if(cb){
        cb(false)
      }
    },
    complete: function() {
      // complete
    }
  })
}

function getCategoryList(cb){//获取组别
  var header = getHeader();
  var where = {};
  where['userName']={
    '$in':[account.username,'-1']
  }
  wx.request({
    url: URL+'1/classes/Category',
    data: {
      'where':where,
      'limit':10,
      'order':'createdAt'
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, // 设置请求的 header
    success: function(res){
      // success
      var results = res.data.results;
      if(results && results.length > 0){
        var categorys = [];
        results.forEach(function(item){
          categorys.push(item.name);
        });
        if(cb){
          cb(categorys);
        }
      }

    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
}

module.exports = {
    login:login,
    getRedBomList:getRedBomList,
    addRedBomb:addRedBomb,
    getCategoryList:getCategoryList
}
