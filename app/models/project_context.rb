# frozen_string_literal: true

# ProjectContext join table model
class ProjectContext < ActiveRecord::Base
    validates_presence_of :project, :context
  
    belongs_to :project
    belongs_to :context
end
