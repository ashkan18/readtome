defmodule ReadtomeWeb.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types(ReadtomeWeb.Schema.JSON)
  import_types(ReadtomeWeb.Schema.EnumTypes)
  import_types(ReadtomeWeb.Schema.InterestTypes)
  import_types(ReadtomeWeb.Schema.LocationType)
  import_types(ReadtomeWeb.Schema.ConnectorTypes)
  import_types(ReadtomeWeb.Schema.UserTypes)
  import_types(Absinthe.Type.Custom)
  import_types(Absinthe.Plug.Types)

  alias ReadtomeWeb.Resolvers

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(Creator, Readtome.Creators.data())
      |> Dataloader.add_source(User, Readtome.Accounts.data())

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end

  query do
    @desc "Find User Interests by location"
    connection field(:user_interests, node_type: :user_interest) do
      arg(:lat, non_null(:float))
      arg(:lng, non_null(:float))
      arg(:term, :string)
      resolve(&Resolvers.Interests.list_users_interests/3)
    end

    field :me, :me do
      resolve(&Resolvers.User.me/3)
    end

    field :reader, :reader do
      arg(:id, non_null(:id))

      resolve(&Resolvers.User.find_by_id/3)
    end

    field :creator, :creator do
      arg(:id, non_null(:id))

      resolve(&Resolvers.Creator.find_by_id/3)
    end

    field :unfurl, :fetched_source do
      arg(:url, non_null(:string))

      resolve(&Resolvers.Creator.unfurl/3)
    end

    field :find_by_isbn, :fetched_source do
      arg(:isbn, :string)
      resolve(&Resolvers.Things.find_by_isbn/3)
    end
  end

  mutation do
    @desc "Signup"
    field :signup, type: :auth do
      arg(:name, non_null(:string))
      arg(:email, non_null(:string))
      arg(:username, non_null(:string))
      arg(:password, non_null(:string))

      resolve(&Resolvers.User.signup/3)
    end

    @desc "Login"
    field :login, type: :auth do
      arg(:username, non_null(:string))
      arg(:password, non_null(:string))

      resolve(&Resolvers.User.login/3)
    end

    @desc "Add User Interest"
    field :add_interest, type: :user_interest do
      arg(:title, non_null(:string))
      arg(:ref, non_null(:string))
      arg(:type, non_null(:interest_type))
      arg(:creator_ids, list_of(:id))
      arg(:creator_names, list_of(:string))
      arg(:thumbnail, :string)
      arg(:looking_for, :boolean)
      arg(:lat, :float)
      arg(:lng, :float)
      arg(:external_id, :string)

      resolve(&Resolvers.Interests.add_interest/3)
    end

    @desc "Update your profile"
    field :update_profile, :reader do
      arg(:name, :string)
      arg(:email, :string)
      arg(:photo, :upload)

      resolve(&Resolvers.User.update_profile/3)
    end

    @desc "Follow someone interesting"
    field :follow, :follow do
      arg(:user_id, non_null(:id))

      resolve(&Resolvers.User.follow/3)
    end
  end
end
