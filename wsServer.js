var wsServer = require('ws').Server;
var mysql  = require('mysql'); 
var net = require('net');

const HOST = '127.0.0.1';
const PORT = 10881;


var conns = new Array();
var usrid = null; //id who connect latest
var userName = null;
var userPhone = null;
var order =null;
var InfoFlag =null;
var userID = null;//id who send info

// var connection = mysql.createConnection({     
//   host     : '127.0.0.1',       //主机
//   user     : 'root',               //MySQL认证用户名
//   password : '',        //MySQL认证用户密码
//   port: '3306',                   //端口号
//   database: 'Intelligent_Hotel',
// }); 
var tcpClient = net.Socket();



function getInfo(msg){
    InfoFlag = msg.substring(msg.indexOf('!')+1,msg.indexOf('@'));
    console.log(InfoFlag);
    userName = msg.substring(msg.indexOf('[')+1,msg.indexOf(']'));
    console.log(userName);
    userPhone = msg.substring(msg.indexOf('{')+1,msg.indexOf('}'));
    console.log(userPhone);
    
    userID = msg.substring(msg.indexOf('^')+1,msg.indexOf('&'));
    console.log(userID);

}
function getOrder(msg){
    InfoFlag = msg.substring(msg.indexOf('!')+1,msg.indexOf('@'));
    console.log(InfoFlag);
    order = msg.substring(msg.indexOf('#')+1,msg.indexOf('$'));
    console.log(order);
    userID = msg.substring(msg.indexOf('^')+1,msg.indexOf('&'));
    console.log(userID);
}

   function qryNewuserid(){
          var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
      connection.connect(function(err){//查询新插入的客户id
    if(err){        
          console.log('[query] - :'+err);
        return;
    }
      console.log('[connection connect]  succeed!');
});  
      var sqlqryNewuserid = 'SELECT MAX(ID) AS Id FROM Client_tb';
      connection.query(sqlqryNewuserid,function(err, result){
           if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }   
       
       //console.log(result[0].Id);

       usrid = result[0].Id;
       console.log(usrid);
        

    
      });
      connection.end;
    }

function InsertNewUser(conn){
      var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 

    connection.connect(function(err){
    if(err){        
          console.log('[query] - :'+err);
        return;
    }
      console.log('[connection connect]  succeed!');
});  
  var sqlInsertUser = 'INSERT INTO `Intelligent_Hotel`.`Client_tb` (`Name`,PhoneNum) VALUES (?,?);';
  var sqlInsertUser_Params = [userName,userPhone];
  connection.query(sqlInsertUser,sqlInsertUser_Params,function(err,result){
   if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }   
         console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');
});
connection.end();
qryNewuserid()；
conn.send(usrid);
userID= usrid;
}
  

 

    function updateUserdata(){
    var connection = mysql.createConnection({     
  host     : '127.0.0.1',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'Intelligent_Hotel',
}); 
              connection.connect(function(err){
    if(err){        
          console.log('[query] - :'+err);
        return;
    }
      console.log('[connection connect]  succeed!');
});  
        var sqlupdate = 'UPDATE `Intelligent_Hotel`.`Client_tb` SET `Name`=?,PhoneNum =? WHERE `ID`=?';
        var sqlupdate_Param = [userName,userPhone,userID];
        connection.query(sqlupdate,sqlupdate_Param,function(err,result){
          if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
   }        
  console.log('--------------------------UPDATE----------------------------');
  console.log('UPDATE affectedRows',result.affectedRows);
  console.log('-----------------------------------------------------------------\n\n');
});
        connection.end;
    }

//---------------------tcp client by nodejs---------------------------------------
tcpClient.connect(PORT, HOST, function(){
  console.log('connect success.');
  tcpClient.write('this is tcp client by Node.js\n');
});

tcpClient.on('data', function(data){
  console.log('received: ', data.toString());
});


//--------------------ws server by nodejs------------------------------------------

wss = new wsServer({port:5566});

wss.addListener('connection',function connhandle(conn){
	console.log('some one connected:');
  //console.log(conn.clients.session);
  //InsertNewUser();
  // var NewUserID = qryNewuserid();
  // console.log(NewUserID);
   //qryNewuserid();





	//conns.push(conn);


	conn.addListener('message',function(msg){
    
		console.log(msg);
   
    tcpClient.write('hello\n');
    // userName = msg.substring(msg.indexOf('[')+1,msg.indexOf(']'));
    // console.log(userName);
    // userPhone = msg.substring(msg.indexOf('{')+1,msg.indexOf('}'));
    // console.log(userPhone);
    // order = msg.substring(msg.indexOf('#')+1,msg.indexOf('$'));
    // console.log(order);
    getInfo(msg);

    
    if(InfoFlag == 'INFORMATION')
    {
      if(userID=='null'){
       InsertNewUser(conn);
       //qryNewuserid();
       //userID = usrid;
       
      
    }else{
      //conn.send(3333);
    //console.log(userID);
      updateUserdata();
    }
      tcpClient.write('one Client connect\n');

    }else if (InfoFlag == 'ORDER') {
      console.log('turn on the light');
    }else{
      console.log('UnKnow infomation');
    }
    
		// for (var i = 0; i <conns.length; i++) {
		// 	if(conns[i]!=conn){
		// 		conns[i].send(msg);
		// 	}
		// }

	});

});


/*wss.addListener('disconnected',function disconnhandle(conn){
	console.log(conn.remoteAddress);
})*/

console.log('running.........');















