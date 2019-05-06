# gpt-2-cloud-run

App for building a text-generation API for generating text from [OpenAI](https://openai.com)'s [GPT-2](https://openai.com/blog/better-language-models/) via gpt-2-simple, and running it in a scalable manner via Google's [Cloud Run](https://cloud.google.com/run/). This app is intended to be used for a finetuned GPT-2 on another dataset.

The base `app.py` runs [starlette](https://www.starlette.io) for async/futureproofness, and is easily hackable if you want to modify GPT-2's input/output, force certain generation parameters, or want to add additional features/endpoints such as tweeting the generated result.

## How to Build the Container

Since Cloud Run is stateless without access to local storage, you must bundle the model within the container. First, download/clone this repo and copy the model into the folder (the model should be in the form of the folder hierarchy `/checkpoint/run1`, which is the case by default for most finetuning scripts)

Then build the image:

```shell
docker build . -t gpt2
```

If you want to test the image locally with the same specs as Cloud Run, you can run:

```shell
docker run -p 8080:8080 --memory="2g" --cpus="1" gpt2
```

You can then visit/`curl` http://0.0.0.0:8080 to get generated text!

Then, tag the image and upload it to the Google [Container Registry](https://console.cloud.google.com/kubernetes/images/list) (note, this will take awhile due to the image size!):

```shell
docker tag gpt2 gcr.io/[PROJECT-ID]/gpt2
docker push gcr.io/[PROJECT-ID]/gpt2
```

Once done, deploy the uploaded image to Cloud Run via [the console](https://console.cloud.google.com/run). **Set Memory Allocated to 2 GB and Maximum Requests Per Container to 2**!

## Interacting with the API in Cloud Run

The API accepts both `GET` and `POST` requests, and returns a JSON object with a `text` attribute that contains the generated text. For example, let's say the Cloud Run URL is `http://example.google.com`:

A `GET` request to the API would be `http://example.google.com?length=100&temperature=0.7` which can be accessed by almost any type of client. (NB: Don't visit the API in a web browser, as the browser prefetch may count as an additional request)

A `POST` request (passing the data as a JSON object) is more ideal as it is both more secure and allows non-ASCII inputs. Python example:

```python
import requests

req = requests.post('http://example.google.com',
                    json={'length': 100, 'temperature': 1.0})
text = req.json()['text']
print(text)
```

## Helpful Notes

* Due to Cloud Run's current 2 GB memory maximum, this app will only work with the 117M "small" GPT-2 model, and not the 345M "medium" model (even if Cloud Run offers a 4 GB option in the future, it would not be enough to support the 345M model).
* Each prediction, at the default 1023 token `length`, will take about 2 minutes to generate. You may want to consider reducing the `length` of the generated text if speed is a concern and/or hardcapping the `length` at the app-level.
* If your API on Cloud Run is actively processing a question less than 1/8th of the time (at the 100 millisecond level) in a given month, you'll stay [within the free tier](https://cloud.google.com/run/pricing) of Cloud Run. If you expect the API to be actively engaged 24/7, you may want to use [Cloud Run on GKE](https://cloud.google.com/run/docs/quickstarts/prebuilt-deploy-gke) instead (and attach a GPU to the nodes + use a `tensorflow-gpu` base for the Dockerfile) and increase concurrency to maximize cost efficiency.
* The concurrency is set to `2` such that if there is only one user of the API (e.g. a cron that pings the API or a random internet user stumbling accross the API), it will not spawn more instances which would increase cost unnecessarily.

## Future Improvements

* Add IP rate limiting ([GitHub Issue](https://github.com/minimaxir/gpt-2-cloud-run/issues/1))
* Add instructions on how to use Cloud Build to avoid the long upload time.
* Add logging to the app to take advantage of Cloud Run's logging capabilities.

## See Also

[A PyTorch Approach to deploying GPT-2 to Cloud Run](https://medium.com/datadriveninvestor/deploy-machine-learning-model-in-google-cloud-using-cloud-run-6ced8ba52aac)

## Maintainer/Creator

Max Woolf ([@minimaxir](https://minimaxir.com))

## License

MIT

## Disclaimer

This repo has no affiliation or relationship with OpenAI.