# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

config :phoenix, :json_library, Jason

# General application configuration
config :readtome,
  ecto_repos: [Readtome.Repo],
  googlebooks_api: %{
    url: System.get_env("GOOGLE_BOOKS_API_URL"),
    key: System.get_env("GOOGLE_BOOKS_API_KEY")
  }

# Configures the endpoint
config :readtome, ReadtomeWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "BCT1d7t8mMOH3ruCo4Ue6LPANM/g3Tqdt3TG7WslkRwm9O9WaXoYBxnL8KSXjFkA",
  render_errors: [view: ReadtomeWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: Readtome.PubSub

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

config :readtome, ReadtomeWeb.Auth.Guardian,
  # Name of your app/company/product
  issuer: "readtome",
  secret_key: "uGV84HYOnL45wwxgNUUsEj9V82RNxp8xCzUWLuA+KO/eiLbNw+Tfs4EVFcy8JJjv"

config :arc,
  storage: Arc.Storage.S3,
  bucket: {:system, "S3_IMAGE_BUCKET"}

config :ex_aws,
  access_key_id: [{:system, "AWS_ACCESS_KEY_ID"}, :instance_role],
  secret_access_key: [{:system, "AWS_SECRET_ACCESS_KEY"}, :instance_role]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
