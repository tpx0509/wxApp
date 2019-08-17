// miniprogram/pages/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      movieList : [],
      count : 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getMovieList()
  },
  getMovieList() { // 请求云函数 - 最新电影数据接口
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
         name : 'movieList',
         data : {
            start : this.data.movieList.length,
            count : this.data.count
         }
      }).then(res => {
         console.log(res)
         wx.hideLoading()
         this.setData({
            movieList : this.data.movieList.concat(JSON.parse(res.result).subjects)
         })
         console.log(this.data.movieList)
      })
      .catch(err => {
         console.log(err)
         wx.hideLoading()
      })
  },
  clickTodetail(event) {
    const id = event.target.dataset.movieid
    wx.navigateTo({
      url: `../detail/detail?movieId=${id}`
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
    this.getMovieList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})