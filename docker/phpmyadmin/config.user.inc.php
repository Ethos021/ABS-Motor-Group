<?php

$host = getenv('PMA_HOST') ?: 'db';
$port = getenv('PMA_PORT') ?: '3306';
$user = getenv('PMA_USER') ?: getenv('MYSQL_USER') ?: 'root';
$password = getenv('PMA_PASSWORD') ?: getenv('MYSQL_PASSWORD') ?: getenv('MYSQL_ROOT_PASSWORD') ?: '';

if ($password === '') {
    exit('phpMyAdmin auto-login requires a database password. Set PMA_PASSWORD, MYSQL_PASSWORD, or MYSQL_ROOT_PASSWORD.');
}

define('DEFAULT_SERVER_INDEX', 1);
$server = DEFAULT_SERVER_INDEX;
$cfg['Servers'][$server]['host'] = $host;
$cfg['Servers'][$server]['port'] = $port;
$cfg['Servers'][$server]['auth_type'] = 'config';
$cfg['Servers'][$server]['user'] = $user;
$cfg['Servers'][$server]['password'] = $password;
$cfg['Servers'][$server]['AllowNoPassword'] = false;
