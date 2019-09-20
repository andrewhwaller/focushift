class Partnership < ApplicationRecord
  belongs_to :user
  belongs_to :partner, class_name: "User"
  has_many :partnerships_projects
  has_many :projects, through: :partnerships_projects
end
