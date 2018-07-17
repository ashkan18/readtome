# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :readtome,
  ecto_repos: [Readtome.Repo],
  googlebooks_api: %{
    url: "https://www.googleapis.com/",
    key: {:system, "GOOGLE_BOOKS_API_KEY"}
  }

# Configures the endpoint
config :readtome, ReadtomeWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "BCT1d7t8mMOH3ruCo4Ue6LPANM/g3Tqdt3TG7WslkRwm9O9WaXoYBxnL8KSXjFkA",
  render_errors: [view: ReadtomeWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Readtome.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

config :readtome, ReadtomeWeb.Auth.Guardian,
  issuer: "readtome", # Name of your app/company/product
  secret_key: "uGV84HYOnL45wwxgNUUsEj9V82RNxp8xCzUWLuA+KO/eiLbNw+Tfs4EVFcy8JJjv"

config :arc,
  storage: Arc.Storage.S3,
  bucket: {:system, "S3_IMAGE_BUCKET"} || "readtomeweb"

config :ex_aws,
  access_key_id: {:system, "S3_ACCESS_KEY_ID"},
  secret_access_key: {:system, "S3_ACCESS_KEY"},
  region: "us-east-1",
  host: "s3.amazonaws.com",
  s3: [
    scheme: "https://",
    host: "s3.amazonaws.com",
    region: "us-east-1"
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
