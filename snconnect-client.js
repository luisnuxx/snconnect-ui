const snconnect = require("./node_modules/snconnect/src/snconnect.js");

var config = {
    instance: "https://empluis.service-now.com",
    username: "luis",
    password: "xptootpx#3"
};


var client = new snconnect.Client(config);
client.getProfile(function(error,result) {
  if(!error) {
    console.log("client profile id :: " + client.profile_id);

    client.getGroups(function(error,result) {
      if(!error) {
        var groups = [];
        for(var key in client.groups) {
            groups.push(client.groups[key].group_id);
        }
        client.getMyMessages(groups,function(error,result) {
          if(!error) {
            //console.log(result);
            var messages = result;
            var html = "";
            for(var key in messages) {
              var msg = messages[key];
              //console.log(msg);
              html+=msg.message+"<hr>";
            }
            console.log(html);
             $('#DIV_MAIN').html(html);
          }
        });
      }
    });

    //console.log(result);
  }
});
