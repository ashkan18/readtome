defmodule ReadtomeWeb.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :readtome,
    error_handler: ReadtomeWeb.Auth.ErrorHandler,
    module: ReadtomeWeb.Auth.Guardian
  #plug Guardian.Plug.EnsureAuthenticated
  # If there is a session token, validate it
  plug Guardian.Plug.VerifySession, claims: %{"typ" => "access"}
  # If there is an authorization header, validate it
  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
  # Load the user if either of the verifications worked
  plug Guardian.Plug.LoadResource, ensure: true
end