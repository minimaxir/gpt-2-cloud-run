# gpt-2-cloud-run

App for building a text-generation API for generating text from [OpenAI](https://openai.com)'s [GPT-2](https://openai.com/blog/better-language-models/) via gpt-2-simple, and running it in a scalable manner via Google's [Cloud Run](https://cloud.google.com/run/). You can run the app independently if you want, especially if you want to use a GPU.

The base `app.py` runs [starlette](https://www.starlette.io) for async/futureproofness, and is easily hackable if you want to modify GPT-2's input/output, or want to add additional features such as tweeting the generated result.

## Helpful Notes

* If your API on Cloud Run is actively engaged 1/8th of the time (at the 100 millisecond level) in a given month or less, you'll stay [within the free tier](https://cloud.google.com/run/pricing) of Cloud Run. If you expect the API to be actively engaged 24/7, you may want to use [Cloud Run on GKE](https://cloud.google.com/run/docs/quickstarts/prebuilt-deploy-gke) instead (and attach a GPU to the nodes + use a `tensorflow-gpu` base for the Dockerfile) and increase concurrency to maximize cost efficiency.

## Maintainer/Creator

Max Woolf ([@minimaxir](https://minimaxir.com))

## License

MIT

## Disclaimer

This repo has no affiliation or relationship with OpenAI.