class AddPartnershipIdToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :partnership_id, :integer
  end
end
