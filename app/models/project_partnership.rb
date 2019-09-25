# frozen_string_literal: true

# ProjectPartnership join table model
class ProjectPartnership < ActiveRecord::Base
    validates_presence_of :project, :partnership
  
    belongs_to :project
    belongs_to :partnership
end
