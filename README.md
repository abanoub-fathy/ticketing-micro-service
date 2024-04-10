# Ticketing System with Microservices Architecture for Kubernetes Clusters

This GitHub repository hosts a sophisticated ticketing system meticulously crafted using microservices architecture, designed to seamlessly operate within Kubernetes clusters. The system comprises several microservices, each serving a distinct purpose: tickets, orders, expiration, payments, and client.

## Microservices Overview

- **Tickets Service:** Responsible for handling ticket creation and updates.
- **Orders Service:** Facilitates the creation of orders for specific tickets.
- **Expiration Service:** Monitors orders to ensure timely expiration.
- **Payments Service:** Enables payment processing for unexpired orders.
- **Client Service:** Powers the user interface, built with Next.js.

To tackle concurrency challenges, the system adopts an optimistic approach leveraging versioning mechanisms to maintain data integrity across records.

## Infrastructure Configuration

The repository's `infra` directory encapsulates Kubernetes deployment configurations, offering flexibility for both development and production environments:

- **k8s:** Contains common manifest YAML files suitable for both development and production deployments.
- **k8s-prod:** Holds manifest files tailored specifically for production setups; note that configurations like host values might require adjustments for real Kubernetes clusters.
- **k8s-dev:** Dedicated to housing Kubernetes manifest files tailored for development environments.

## Development Workflow

For streamlined development workflows, the project utilizes Skaffold, simplifying the process of starting and stopping the system.

## GitHub Workflows

This project includes GitHub workflows for Continuous Integration and Continuous Deployment (CI/CD), ensuring that changes made to the codebase are thoroughly tested and deployed automatically. Additionally, there are workflows for testing to maintain code quality and reliability.

## Kubernetes Ingress

Within the `k8s` directory, the system leverages ingress-nginx for efficient routing; refer to the provided link for more information on ingress-nginx integration.

This ticketing system embodies modularity, scalability, and robustness, making it a reliable solution for managing ticketing operations within Kubernetes environments.

## How to Use the Repository

To get started with this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/abanoub-fathy/ticketing-micro-services.git
```

2. Change directory to project folder

```bash
cd ticketing-micro-services
```

3. Set k8s Secrets:

- Setting JWT secret key:

  ```bash
  kubectl create secret generic jwt-secret --from-literal=JWT_SECRET_KEY=<define-secret-here>
  ```

  Response should be:

  ```
  secret/jwt-secret created
  ```

- Setting Stripe secret Keys:

  ```bash
  kubectl create secret generic stripe-secret --from-literal=STRIPE_PUBLISHABLE_KEY=<define-secret-here> --from-literal=STRIPE_SECRET_KEY=<define-secret-here>
  ```

  Response should be:

  ```
  secret/stripe-secret created
  ```

4. Configure the Ingress-Nginx according to your operating system.

- you can visit the [ingress-nginx offical page](https://kubernetes.github.io/ingress-nginx/) and following the installation steps according to your OS.

6. Replace docker user name

- Make sure to replace my docker user name from used images in the infra directory if you want to build and a new image and push it to docker hub.

7. Use skaffold to run the project

- Install skaffold to start the project from [skaffold offical page](https://skaffold.dev/)

- Run the project

```bash
skaffold dev
```
