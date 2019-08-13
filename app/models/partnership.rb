class Partnership < ApplicationRecord
  has_many :projects
  belongs_to :user
  belongs_to :partner, class_name: "User"
end
