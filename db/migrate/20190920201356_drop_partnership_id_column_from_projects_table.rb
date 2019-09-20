class DropPartnershipIdColumnFromProjectsTable < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :partnership_id
  end
end
