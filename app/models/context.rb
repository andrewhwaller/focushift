# frozen_string_literal: true

# Context model; no methods
class Context < ApplicationRecord
  belongs_to :user
  has_many :project_contexts, dependent: :destroy
  has_many :projects, through: :project_contexts

  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id
end
