defmodule ReadtomeWeb.MeView do
  use ReadtomeWeb, :view

  def render("index.json", %{user: user}), do: render_one(user, ReadtomeWeb.UserView, "user.json")
  def render("inquiries.json", %{inquiries: inquiries, requests: requests}) do
    %{
      inquiries: render_many(inquiries, ReadtomeWeb.InquiryView, "inquiry.json"),
      requests: render_many(requests, ReadtomeWeb.InquiryView, "inquiry.json")
    }
  end

  def render("user.json", %{user: user}), do: render_one(user, ReadtomeWeb.UserView, "user.json")
end
