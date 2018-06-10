# log4js-logstash-redis
The logstash-reids appender for log4js, which using redis list to record log.

## Usage
- Install
```
npm install @hong-boy/log4js-logstash-redis --save
or
yarn add @hong-boy/log4js-logstash-redis
```

- Log4js Configuration
```
logstash: {
	type: '@hong-boy/log4js-logstash-redis',
	key: 'logstash-key',
	redis: {// ioredis configuration
		host: 'localhost',
		port: 6379,
		lazyConnect: true,
	},
	layout: {
		type: 'pattern',
		pattern: `%d %p %z --- [frontend-web] %c : %m%n`,
	}
}
```