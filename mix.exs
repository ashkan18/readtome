defmodule Readtome.Mixfile do
  use Mix.Project

  def project do
    [
      app: :readtome,
      version: "0.0.1",
      elixir: "~> 1.4",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Readtome.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:absinthe_plug, "~> 1.5.2"},
      {:absinthe_relay, "~> 1.5.0"},
      {:arc, ">= 0.11.0"},
      {:bcrypt_elixir, "~> 0.12"},
      {:comeonin, "~> 4.0"},
      {:cowboy, "~> 2.7"},
      {:ecto_sql, "~> 3.0"},
      {:ex_aws_s3, "~> 2.0"},
      {:ex_aws, "~> 2.1.0"},
      {:geo_postgis, "~> 3.1"},
      {:gettext, "~> 0.11"},
      {:guardian, "~> 1.0"},
      {:hackney, "~> 1.6"},
      {:httpoison, ">= 0.0.0"},
      {:jason, "~> 1.1"},
      {:phoenix_ecto, "~> 4.0"},
      {:phoenix_html, "~> 2.14"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:phoenix_pubsub, "~> 2.0"},
      {:phoenix, "~> 1.5.6"},
      {:plug_cowboy, "~> 2.4.1"},
      {:poison, ">= 3.1.0"},
      {:postgrex, ">= 0.0.0"},
      {:sweet_xml, "~> 0.6"},
      {:tesla, "~> 1.3.0"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
