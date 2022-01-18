<?php
if(isset($_POST)){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['name'];
    $message = $_POST['message'];

    $mailTo = 'tayebhakkar@yahoo.fr';
    $head = "From: ".$email;
    $text = "Mail reçu de la part de : ".$name.".\n\n".$message;
    mail($mailTo,$subject,$text,$head);
}
?>