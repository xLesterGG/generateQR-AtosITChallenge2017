<?php
    include('dbconfig.php');

    // $_POST['nxtAccountNumber']

    // echo $_POST['value'];

    // $data = json_decode(file_get_contents("php://input"));
    parse_str(file_get_contents("php://input"),$put_vars);

    if($put_vars['recordID'] !== '' || $put_vars['numberOfBatches'] !== '')
    {
        $recordID = $put_vars['recordID'];
        $numberofBatches = $put_vars['numberOfBatches'];

        $sql = "UPDATE nxtAccounts SET numberOfBatches = '$numberofBatches' WHERE recordID = '$recordID' ";
<<<<<<< HEAD

        // echo $sql;

=======

        // echo $sql;

>>>>>>> 968e7003e3233e3290475041230abbc1eff7c638
        if($conn->query($sql) === true){
            echo "Successfully updated batch count";
        }
        else{
            echo "Error: " . $sql;
        }

<<<<<<< HEAD

=======
        // $result = @mysql_query($sql);
        //
        // if($result)
        // {
        //     echo "Successfully updated batch count";
        // }
        // else
        // {
        //     echo "Error: " . $sql;
        // }
>>>>>>> 968e7003e3233e3290475041230abbc1eff7c638
    }

?>
