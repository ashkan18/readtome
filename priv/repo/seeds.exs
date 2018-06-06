# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Readtome.Repo.insert!(%Readtome.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Readtome.Books.create_book(%{isbn: "12312", large_cover_url: "https://images-na.ssl-images-amazon.com/images/I/415X2YDkv5L._SX323_BO1,204,203,200_.jpg", small_cover_url: "https://images-na.ssl-images-amazon.com/images/I/415X2YDkv5L._SX323_BO1,204,203,200_.jpg", medium_cover_url: "https://images-na.ssl-images-amazon.com/images/I/415X2YDkv5L._SX323_BO1,204,203,200_.jpg", name: "Breakfast of Champions: A Novel"})

Readtome.Accounts.create_user(%{name: "ashkan", email: "ashkan17@test.biz", sex: "M", age: 35})

Readtome.Books.create_book_instance(%{condition: "fair", medium: "text", offerings: "readtome", user_id: 1, book_id: 1, location: %Geo.Point{coordinates: {40.676875,-73.96430}, srid: 4326}})