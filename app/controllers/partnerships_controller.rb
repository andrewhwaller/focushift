class PartnershipsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_active_user
  
  def index
    @partnership = Partnership.new
    @partnerships = current_user.partnerships.all + Partnership.all.where(partner_id: current_user.id)
  end

  def show
    @partnership = Partnership.find(params[:id])
    @partnership_projects = Project.all.where(partnership_id: @partnership.id)
  end

  def new
    @partnership = Partnership.new
  end

  def create
    @partnership = Partnership.new(partnership_params)
    @partnership.user_id = current_user.id
    if @partnership.valid?
      @partnership.save
      redirect_to partnerships_path
    else
      render :new
    end
  end

  def edit
    @partnership = Partnership.find(params[:id])
  end

  def update
    @partnership = Partnership.find(params[:id])
    @partnership.update(partnership_params)
    if @partnership.valid?
      redirect_to partnerships_path
    else
      render :edit
    end
  end

  def destroy
    @partnership = Partnership.find(params[:id])
    @partnership.destroy
    redirect_to partnerships_path
  end

  private

  def partnership_params
    params.require(:partnership).permit!
  end
end
