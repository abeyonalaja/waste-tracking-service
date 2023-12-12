class Env
  def self.start_page_url
    (ENV['START_PAGE_URL']) || 'https://track-waste-pre.azure.defra.cloud/'
  end

  def self.test_env
    ENV['ENVIRONMENT'] || 'PRE'
  end

  def self.start_shutter_pages_url(page_code)
    "#{Env.start_page_url}/#{page_code}"
  end

  def self.export_pdf_url(id)
    "#{Env.start_page_url}/export/submitted/download?id=#{id}"
  end

end

