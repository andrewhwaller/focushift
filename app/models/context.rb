class Context < ApplicationRecord
  belongs_to :user
  has_many :projects
end
