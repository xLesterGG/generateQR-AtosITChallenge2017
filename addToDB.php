<?php
    include('dbconfig.php');

    if(isset($_POST['nxtAccountNumber']) || isset($_POST['numberOfBatches']) || isset($_POST['secretPhrase']))
    {
        $nxtAccountNumber = $_POST['nxtAccountNumber'];
        $numberOfBatches = $_POST['numberOfBatches'];
        $secretPhrase = $_POST['secretPhrase'];

        $sql = "INSERT INTO nxtAccounts(nxtAccountNumber,numberOfBatches,secretPhrase) VALUES ('$nxtAccountNumber',$numberOfBatches,'$secretPhrase')";
        // $sql = "INSERT INTO nxtAccounts(nxtAccountNumber,numberOfBatches,secretPhrase) VALUES ('aaa','bb','cc');";

        if($conn->query($sql))
        {
            echo "Successfully added";
        }
        else{
            echo "Error: " . $sql ;
        }
    }

?>
