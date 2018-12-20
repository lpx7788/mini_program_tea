const api = {
  load_url: '/index.php?act=connect&op=index', // 登录接口
  add_good_url: '/index.php?act=seller_goods&op=fx_goods_add', // 添加商品接口
  edit_good_url: '/index.php?act=seller_goods&op=edit_goods', // 编辑商品接口
  upload_image_url: '/index.php?act=seller_goods&op=image_upload', // 上传商品图片
  upload_detail_image_url: '/index.php?act=goods&op=upload_goods_body', // 上传详情图接口
  goods_list_url: '/index.php?act=member_index&op=get_goods_list', // 首页接口
  create_order_url: '/index.php?act=member_vr_buy&op=buy_step3', // 生成订单接口
  get_pay_info_url: '/index.php?act=member_payment&op=payfee', // 生成支付信息接口
  get_goods_detail_url: '/index.php?act=goods&op=get_goods_info', // 获取商品详情接口
  pay_success_callback_url: '/index.php?act=member_vr_order&op=order_success', // 支付成功回调接口
  browe_url: '/index.php?act=member_index&op=up_brower', // 浏览接口
  share_url: '/index.php?act=member_index&op=up_forward', // 转发接口
  invite_url: '/index.php?act=goods&op=get_goods_member_invite', // 分销接口
  apply_withdraw_url: '/index.php?act=member_index&op=apply_withdraw',//提现接口
  withdraw_list_url: '/index.php?act=member_index&op=withdraw_list',//提现列表
  withdraw_detail_url: '/index.php?act=member_index&op=withdraw_detail',//提现详情
  question_url: '/index.php?act=member_index&op=question',//常见问题列表
  question_detail_url: "/index.php?act=member_index&op=question_detail",//问题详情
  money_fee_url: '/index.php?act=member_index&op=money_fee',//账户明细
  feedback_add_url: '/index.php?act=member_feedback&op=feedback_add',//反馈意见
  get_programs_url: '/index.php?act=goods&op=get_own_goods',//获取所有项目
  conversion_url: '/index.php?act=goods&op=goods_detail',//分享分销
  money_url: '/index.php?act=member_index&op=my_data',//可提现余额
  join_list_url: '/index.php?act=member_index&op=my_order',//我的报名列表
  join_detail_url: '/index.php?act=member_index&op=order_detail',//我的报名详情
  code_url: '/index.php?act=member_index&op=get_wx_code',//获取小程序码
  poster_url: '/index.php?act=member_index&op=my_rule',//获取首页海报
  get_problem: '/index.php?act=member_index&op=question_list',//获取问题列表
  post_answer: '/index.php?act=member_index&op=submit_questionnaire',//提交问题答案
  get_user_answer: '/index.php?act=member_index&op=store_status',//提交问题答案
  partner_url: '/index.php?act=member_index&op=accessory',//成为合伙人
  upload_packaging_image_url: '/index.php?act=index&op=upload', // 上传包装页面logo图接口
  packaging_url: '/index.php?act=member_index&op=package', // 我的包装页面
  massage_url: '/index.php?act=member_index&op=getMessage', // 我的消息
  phoneBand_url: '/index.php?act=member_index&op=phoneBand', // 绑定手机
  get_sms_captcha: '/index.php?act=connect&op=get_sms_captcha', // 验证码
  get_Mobile: '/index.php?act=member_index&op=getMobile', // 有没有绑定
  getInviteUser_url: '/index.php?act=member_index&op=getInviteUser', // 推广邀请人
  getQr_code_url: '/index.php?act=member_index&op=getQr_code', // 推广二维码
  pack_slider_url: '/index.php?act=index&op=getPack', // 我的包装轮播图
  getGardenList_url: '/index.php?act=member_index&op=getGardenList', // 我的量产列表
  getTeaYield_url: '/index.php?act=member_index&op=getTeaYield', // 我的量产列表详情
  addTeaDemand_url: '/index.php?act=member_index&op=addTeaDemand', // 我的量产列茶叶需求
  money_fee_url: '/index.php?act=member_index&op=money_fee', // 我的收入
  withdraw_url: '/index.php?act=member_index&op=apply_withdraw', //提现
  get_integral_url: '/index.php?act=member_index&op=getIntegral', //我的->积分

}
export default api;