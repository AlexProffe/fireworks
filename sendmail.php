<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'PHPMailer-6.6.3/src/Exception.php';
require_once 'PHPMailer-6.6.3/src/PHPMailer.php';
require_once 'PHPMailer-6.6.3/src/SMTP.php';

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->SMTPAuth = true;
$mail->SMTPDebug = 0;$mail->CharSet = 'UTF-8';

$mail->Host = 'mailbe05.hoster.by';
$mail->Port = 465;
$mail->Username = 'admin@1.vipsalut.by';
$mail->Password = 'Pse#MO@k02';

$mail->isHTML(true);

$mail->setFrom('admin@1.vipsalut.by', 'Белый тигр');

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