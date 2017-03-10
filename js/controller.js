var app = angular.module("myApp",[]);

app.controller("myCtrl",function($scope,$http){
    $scope.showgetbutton = true;
    $scope.showqrgen = true;

    $scope.currentbatch = 0;
    $scope.recordID = 1;

    var qrcode = new QRCode(document.getElementById("qrcode"));

    $http.get('getLast.php')
        .then(
            function(response){
                if(response.data== "No data yet"){
                    console.log('db no data');
                    $scope.password = document.results.text.value;
                    console.log($scope.password);

                    $scope.showqrgen = false;

                }
                else{
                    console.log(response.data.accs[0].numberOfBatches);

                    //console.log(response.data.accs[0])
                    if(response.data.accs[0].numberOfBatches <100)
                    {
                        $scope.password = response.data.accs[0].secretPhrase;
                        $scope.accNum = response.data.accs[0].nxtAccountNumber;
                        $scope.showgetbutton = false;

                        $scope.currentbatch = parseInt(response.data.accs[0].numberOfBatches);
                        $scope.recordID = response.data.accs[0].recordID;
                    }
                    else{
                        $scope.password = document.results.text.value;
                        $scope.showqrgen = false;
                        $scope.recordID = parseInt(response.data.accs[0].recordID) + 1;

                    }

                }
            },
            function(response){
                alert("Database error, please check with your system administrator");
                console.log(response);
            }
        );



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
                    alert("ERROR in making account,po contact your system administrator");
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
                    $scope.addToDB();

                    $scope.showqrgen = true;


                }
            },
            function(response){
                alert("ERROR in checking account, contact your system administrator");
                console.log(response);
            }
        );
    }


    $scope.addToDB = ()=>{
        var url = "addtoDB.php";

        var data = $.param({
            nxtAccountNumber: $scope.accNum,
            numberOfBatches: 0,
            secretPhrase:$scope.password
        });

        //console.log("data is" + data);
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post(url,data,config)
            .then(
                function(response){
                    console.log(response);
                },
                function(response){
                    alert('An error has occured, please check console for more information');
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
    //    qrcode.clear();
        qrcode.makeCode(JSON.stringify(obj));


        $scope.showqrgen = false;

        var url = "updateBatchCount.php";


        console.log()

        var data = $.param({
            recordID : $scope.recordID,
            numberOfBatches : ($scope.currentbatch + 1)
        });

        $scope.currentbatch = $scope.currentbatch + 1;

        console.log(data);



        if($scope.currentbatch >100){
            alert('Account has over 100 batches, the page will now refresh for a new account.');
            location.reload();
        }
        else{
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            $http.put(url, data, config)
    			.then(
    				function (response) {
                        console.log("success");
                        console.log(response);

    				},
    				function (response) {
                        alert('Something went wrong when trying to update number of batches, please check console');
                        console.log(response);
    				}
    			);
        }



    }

    $scope.clearqr = ()=>{
        // qrcode.clear();
        if($scope.accNumber!='')
        {
            $scope.showqrgen = true;
        }
    }



});
