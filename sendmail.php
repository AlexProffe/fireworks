<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-6.6.3/src/Exception.php';
require 'PHPMailer-6.6.3/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'PHPMailer-6.6.3/language/');
$mail->isHTML(true);

$mail->setFrom('info@fls.guru', 'Белый тигр');

$mail->addAddress('1840002@mail.ru');
$mail->addAddress('salut-show@mail.ru');

$mail->Subject = ('Заявка с сайта vipsalut.com');

$body = '<h1>Заявка на консультацию с сайта vipsalut.com';

if(trim(!empty($_POST['name']))) {
    $body.='<p><strong>Имя: </strong> '.$_POST['name'].'</p>';
}

if(trim(!empty($_POST['phone']))) {
    $body.='<p><strong>Номер телефона: </strong> '.$_POST['phone'].'</p>';
}

if(trim(!empty($_POST['city']))) {
    $body.='<p><strong>Город: </strong> '.$_POST['city'].'</p>';
}

$mail->Body = $body;

if(!$mail->send()) {
    $message = 'Ошибка';
} else {
    $message = 'Данные отправлены';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>