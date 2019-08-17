// pages/detail/detail.js
const db = wx.cloud.database() // 初始化云数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detail : null,
      content : '' , // 评价的内容
      score : 5, // 评价的分数
      tempImages : [],
      fileIds : [],
      movieId : -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
       movieId : options.movieId
    })
    this.getDetail(options.movieId)
  },  
  getDetail(id) {
      wx.cloud.callFunction({
         name : "getDetail",
         data : {
            movieId : id
         }
      })
      .then(res => {
        console.log(res)
        wx.hideLoading()
        this.setData({
           detail : JSON.parse(res.result)
        })
        console.log(this.data.detail)
      })
      .catch(err => {
        wx.hideLoading()
         console.log(err)
      })
  },
  onContentChange(option) { // 评价
    this.setData({
      content: option.detail
    })
  },
  onScoreChange(option) { // 评分
     this.setData({
        score : option.detail
     })
  },
  uploadImg() { // 上传图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempImages : this.data.tempImages.concat(tempFilePaths)
        })
        console.log(this.data.tempImages)
      }
    })
  },
  submit() { // 提交评价
      if(!this.data.content) {
         wx.showModal({
           title: '请输入评价',
           content: '快输入评价',
           showCancel : false
         })
         return
      }
      wx.showLoading({
        title: '评论中',
      })
      let promiseArr = []
      if(this.data.tempImages.length !== 0) {
        // 上传图片到云存储
        for (let i = 0; i < this.data.tempImages.length; i++) {
          const curImage = this.data.tempImages[i];
          const extName = /\.\w+$/.exec(curImage)[0];// 后缀名
          promiseArr.push(
            new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: new Date().getTime() + extName,
                // 指定要上传的文件的小程序临时文件路径
                filePath: curImage,
                // 成功回调
                success: res => { // 返回文件id
                  console.log('上传成功', res)
                  this.setData({
                    fileIds: this.data.fileIds.concat(res.fileID)
                  })
                  resolve(res)
                },
                failed: err => {
                  console.error('上传失败', err)
                }
              })
            })
          )

        }
      }
      Promise.all(promiseArr)
      .then(res => {
          console.log('所有图片上传成功',res)
          // 讲评价信息存入数据库
          db.collection('userEvaluate').add({
              data : {
                movieId: this.data.movieId,
                content: this.data.content,
                score: this.data.score,
                fileIds: this.data.fileIds // 上传图片的文件id数组集合
              }
          }).then(res => {
             console.log('存入数据库成功',res)
             wx.hideLoading()
             wx.showToast({
               title: '评价成功',
             })
          })
          .catch(err => {
            wx.hideLoading()
            console.log('存入数据库失败',err)
          })
      })
      .catch(err => {

      })
      
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})