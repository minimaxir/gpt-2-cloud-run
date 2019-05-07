# Using Cloud Build to Deploy GPT-2 from Google Compute Engine

If you are using Google Compute Engine to train a GPT-2 model, it's more economical to build it in the cloud instead of downloading it, building it, then reuploading it.

This workflow moves the file from Google Compute Engine to Google Cloud Storage, then uses Cloud Builder to build the container and upload it to Cloud Registry.

## From Google Compute Engine to Google Cloud Storage

First, create a bucket in Google Cloud Storage to save your model. Then give full scope permissions to your Google Compute Engine VM (you'll need to Stop and Edit it if it isn't already).

![scope](/docs/scope.png)

In the GCE VM, if you had to change the scope, you'll need to [remove the cached gsutil](https://stackoverflow.com/questions/28612080/resumableuploadabortexception-403-insufficient-permission):

```shell
rm -rf ~/.gsutil
```

Then you can copy the `checkpoint` folder to a GCS bucket of your choice.

```shell
gsutil -m cp -r checkpoint gs://<BUCKET>
```

Upload your `app.py` and `Dockerfile` to the same GCS bucket.

## From Google Cloud Storage to Cloud Builder

The `cloudbuild.yaml` file will use Google Cloud Builder to build the container by copying the files from the GCS bucket, building them, then pushing to the Container Registry. On your local computer, replace the `_BUCKET` with your GCS bucket and `_IMAGE` with the destination name, then run:

```shell
gcloud builds submit --no-source --config=cloudbuild.yaml
```

The container should then appear in the Container Registry under the `_IMAGE` name!