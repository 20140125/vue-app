let code={
    FORBIDDEN:403,  //禁止访问
    METHOD_ERROR:405, //方法错误
    Unauthorized:401, //未登录
    SUCCESS:200, //成功
    ERROR:201,   //错误
    QQ:785973567,
    Socket:process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:2120/' : 'https://www.fanglonger.com:2120/',
    Websocket:process.env.NODE_ENV === 'development' ? 'ws://127.0.0.1:7272/' : 'wss://www.fanglonger.com:7272/',
};
module.exports = code;

