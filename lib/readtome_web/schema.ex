defmodule ReadtomeWeb.Schema do
  use Absinthe.Schema
  use Absinthe.Relay.Schema, :modern

  import_types(ReadtomeWeb.Schema.JSON)
  import_types(ReadtomeWeb.Schema.EnumTypes)
  import_types(ReadtomeWeb.Schema.ThingTypes)
  import_types(ReadtomeWeb.Schema.LocationType)
  import_types(ReadtomeWeb.Schema.CreatorTypes)
  import_types(ReadtomeWeb.Schema.BookTypes)
  import_types(ReadtomeWeb.Schema.UserTypes)
  import_types(Absinthe.Type.Custom)
  import_types(Absinthe.Plug.Types)

  alias ReadtomeWeb.Resolvers

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(Creator, Readtome.Creators.data())
      |> Dataloader.add_source(User, Readtome.Accounts.data())
      |> Dataloader.add_source(Book, Readtome.Books.data())

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end

  query do
    @desc "Find Book Instance by location"
    field :book_instances, list_of(:book_instance) do
      arg(:lat, non_null(:float))
      arg(:lng, non_null(:float))
      arg(:term, :string)
      arg(:offerings, list_of(:string))
      resolve(&Resolvers.Book.find_book_instances/3)
    end

    field :book, :book do
      arg(:isbn, :string)
      resolve(&Resolvers.Book.find_by_isbn/3)
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

    field :unfurl, :unfurled_link do
      arg(:url, non_null(:string))

      resolve(&Resolvers.Creator.unfurl/3)
    end
  end

  mutation do
    @desc "Create a book offering"
    field :post_book, type: :book_instance do
      arg(:book_id, non_null(:id))
      arg(:lat, non_null(:float))
      arg(:lng, non_null(:float))
      arg(:offerings, list_of(:offering))
      arg(:medium, non_null(:medium))

      resolve(&Resolvers.BookInstance.post_book/3)
    end

    @desc "Inquiry for a book"
    field :show_interest, type: :inquiry do
      arg(:book_instance_id, non_null(:id))
      arg(:offering, non_null(:offering))

      resolve(&Resolvers.BookInstance.inquiry/3)
    end

    @desc "Accept an inquiry"
    field :accept_inquiry, type: :inquiry do
      arg(:inquiry_id, non_null(:id))

      resolve(&Resolvers.Connector.accept/3)
    end

    @desc "Reject an inquiry"
    field :reject_inquiry, type: :inquiry do
      arg(:inquiry_id, non_null(:id))

      resolve(&Resolvers.Connector.reject/3)
    end

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

      resolve(&Resolvers.User.add_interest/3)
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
