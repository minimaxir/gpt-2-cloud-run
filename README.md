# gpt-2-cloud-run

App for building a text-generation API for generating text from [OpenAI](https://openai.com)'s [GPT-2](https://openai.com/blog/better-language-models/) via gpt-2-simple, and running it in a scalable manner via Google's [Cloud Run](https://cloud.google.com/run/). You can run the app independently if you want, especially if you want to use a GPU.

The base `app.py` runs [starlette](https://www.starlette.io) for async/futureproofness, and is easily hackable if you want to modify GPT-2's input/output, or want to add additional features such as tweeting the generated result.

## How to Build the Container

Since Cloud Run is stateless without access to local storage, you must bundle the model within the container. First, download/clone this repo and copy the model into the folder (the model should be in the form of the folder `/checkpoint/run1`)

Then build the image:

```shell
docker build . -t gpt2
```

If you want to test the image locally with the same specs as Cloud Run, you can run:

```shell
docker run -p 8080:8080 --memory="2g" --cpus="1" gpt2
```

You can then visit/`curl` http://0.0.0.0:8080 to get generated text!

## Helpful Notes

* Due to Cloud Run's current 2 GB memory maximum, this app will only work with the 117M "small" GPT-2 model, and not the 345M "medium" model (if Cloud Run offers a 4 GB option in the future, it should support the 345M model).
* Each prediction, at the default 1023 token `length`, will take about 100 seconds to generate. You may want to consider reducing the `length` of the generated text if speed is a concern and/or hardcapping the `length` at the app-level.
* If your API on Cloud Run is actively engaged 1/8th of the time (at the 100 millisecond level) in a given month or less, you'll stay [within the free tier](https://cloud.google.com/run/pricing) of Cloud Run. If you expect the API to be actively engaged 24/7, you may want to use [Cloud Run on GKE](https://cloud.google.com/run/docs/quickstarts/prebuilt-deploy-gke) instead (and attach a GPU to the nodes + use a `tensorflow-gpu` base for the Dockerfile) and increase concurrency to maximize cost efficiency.
* The concurrency is set to `2` such that if there is only one user of the API (e.g. a cron that pings the API or a random internet user stumbling accross the API), it will not spawn more instances which would increase cost unnecessarily.

## Maintainer/Creator

Max Woolf ([@minimaxir](https://minimaxir.com))

## License

MIT

## Disclaimer

This repo has no affiliation or relationship with OpenAI.