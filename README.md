# AttentiveMind

## Build
### Rebuild and push Docker images to Heroku
#### attentive-mind-client-service
```
docker build -t attentive-mind-client-service --platform linux/amd64 .
docker tag attentive-mind-client-service registry.heroku.com/attentive-mind-client-service/web
docker push registry.heroku.com/attentive-mind-client-service/web
heroku container:release web -a attentive-mind-client-service
```
#### attentive-mind-web-service
```
docker build -t attentive-mind-web-service --platform linux/amd64 .
docker tag attentive-mind-web-service registry.heroku.com/attentive-mind-web-service/worker
docker push registry.heroku.com/attentive-mind-web-service/worker
heroku container:release worker --app attentive-mind-web-service
```
#### attentive-mind-nlp-service
```
docker build -t attentive-mind-nlp-service --platform linux/amd64 .
docker tag attentive-mind-nlp-service registry.heroku.com/attentive-mind-nlp-service/web
docker push registry.heroku.com/attentive-mind-nlp-service/web
heroku container:release web -a attentive-mind-nlp-service
```

### View Heroku logs
```
heroku logs --tail --app <service name>
```