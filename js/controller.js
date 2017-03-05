var app = angular.module("myApp",[]);

app.controller("myCtrl",function($scope,$http){
    $scope.password = document.results.text.value;
    console.log($scope.password);


    $scope.makeAccount = (input)=>{
    //    console.log(input);
        //NXT-F2PW-KURF-MWKL-HKEAK
          $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountId&secretPhrase='+encodeURIComponent("NXT-GW48-BC6N-GUWN-ASCFB"))
        //$http.get('http://174.140.168.136:6876/nxt?requestType=getAccountId&secretPhrase='+ encodeURIComponent("bridge twice ash force birth pause trickle sharp tender disappear spoken kid"))
            .then(
                function(response){
                    console.log(response.data);
                    //http://http://174.140.168.136:6876/nxt?requestType=getAccountPublicKey&account=GENERATED_ACCOUNT_NUMBER
                    $scope.checkAccount(response.data.accountRS);

                },
                function(response){
                    alert("ERROR in making account, contact your system administrator");
                    console.log(response);
                }
            );
        //174.140.168.136:6876/nxt?requestType=getAccountId&secretPhrase=
    }

    $scope.checkAccount = (accNumber)=>{
        $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountPublicKey&account='+encodeURIComponent(accNumber))
        .then(
            function(response){
                if(response.data.hasOwnProperty('publicKey')){
                    //console.log("haspublic key");
                    alert('Generated account has existed, the page will now refresh. Please try again');
                    location.reload();
                }
                else{
                    $scope.accNum = accNumber;
                }
            },
            function(response){
                alert("ERROR in checking account, contact your system administrator");
                console.log(response);
            }
        );
    }



    $scope.getQRData = (accNum,batchID,productName)=>{
        //console.log(accNum + batchID);
        var obj = {};

        obj.nxtAccNum = accNum;
        obj.batchID = batchID;
        obj.productName = productName;

        console.log(obj);

        var qrcode = new QRCode(document.getElementById("qrcode"));

        qrcode.makeCode(JSON.stringify(obj));
    }



});
