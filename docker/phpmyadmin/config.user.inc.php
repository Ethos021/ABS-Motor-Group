<?php

$hostPattern = '/^[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?$/'; // docker service name or hostname label
$userPattern = '/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/'; // MySQL user with alphanumerics, underscores, dots, hyphens
$minPasswordLength = 8;

$validateHost = static function (string $host) use ($hostPattern): bool {
    if (filter_var($host, FILTER_VALIDATE_IP) !== false) {
        return true;
    }

    if (filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) !== false) {
        return true;
    }

    return (bool) preg_match($hostPattern, $host);
};

$host = trim(getenv('PMA_HOST') ?: 'db');
$portEnv = getenv('PMA_PORT');
$port = is_numeric($portEnv) ? (int) $portEnv : 3306;
$port = ($port >= 1 && $port <= 65535) ? $port : 3306;
$user = trim(getenv('PMA_USER') ?: getenv('MYSQL_USER') ?: '');
$password = trim(getenv('PMA_PASSWORD') ?: getenv('MYSQL_PASSWORD') ?: '');

if (!$validateHost($host)) {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a valid host for PMA_HOST (e.g., db, localhost, or an IP address).');
}

if ($user === '') {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a database user. Set PMA_USER or MYSQL_USER.');
}

if (!preg_match($userPattern, $user)) {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a safe database user name (letters, numbers, underscores, dots, and hyphens).');
}

if ($password === '') {
    http_response_code(400);
    die('phpMyAdmin auto-login requires a database password. Set PMA_PASSWORD or MYSQL_PASSWORD.');
}

if (strlen($password) < $minPasswordLength) {
    http_response_code(400);
    die("phpMyAdmin auto-login requires a database password of at least {$minPasswordLength} characters.");
}

$cfg['Servers'][1]['host'] = $host;
$cfg['Servers'][1]['port'] = $port;
$cfg['Servers'][1]['auth_type'] = 'config';
$cfg['Servers'][1]['user'] = $user;
$cfg['Servers'][1]['password'] = $password;
$cfg['Servers'][1]['AllowNoPassword'] = false;
