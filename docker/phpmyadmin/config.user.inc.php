<?php

$host = trim(getenv('PMA_HOST') ?: 'db');
$portEnv = getenv('PMA_PORT');
$port = is_numeric($portEnv) ? (int) $portEnv : 3306;
$port = ($port >= 1 && $port <= 65535) ? $port : 3306;
$user = trim(getenv('PMA_USER') ?: getenv('MYSQL_USER') ?: '');
$password = trim(getenv('PMA_PASSWORD') ?: getenv('MYSQL_PASSWORD') ?: '');

$hostIsValid = filter_var($host, FILTER_VALIDATE_IP) !== false
    || filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) !== false
    || preg_match('/^[A-Za-z0-9._-]+$/', $host);

if (!$hostIsValid) {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a valid host for PMA_HOST.');
}

if ($user === '') {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a database user. Set PMA_USER or MYSQL_USER.');
}

if ($password === '') {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a database password. Set PMA_PASSWORD or MYSQL_PASSWORD.');
}

$cfg['Servers'][1]['host'] = $host;
$cfg['Servers'][1]['port'] = $port;
$cfg['Servers'][1]['auth_type'] = 'config';
$cfg['Servers'][1]['user'] = $user;
$cfg['Servers'][1]['password'] = $password;
$cfg['Servers'][1]['AllowNoPassword'] = false;
