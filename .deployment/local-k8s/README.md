# Local K8s Cluster for Development

The purpose of this cluster is to test K8s templates for deployment on GKE. All local services rely on external, live databases.

## Prerequisites

1. Have a Kubernetes cluster installed. Check your cluster by running `kubectl cluster-info`

## Environment variables

The K8s cluster will rely on a K8s Secret for configuring environment variables.
To define these environment variables, create a `.env` file in the same folder as the `start.sh` script.

```.env
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGODB_URI=
POSTGRES_URI=
```

## Running the K8s cluster

1. Run the `build.sh` shell script to build all docker images locally first.
2. Run the `start.sh` shell script after to apply the K8s-templates to your local cluster
