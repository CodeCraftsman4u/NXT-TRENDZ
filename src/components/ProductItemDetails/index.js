// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsData: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    // await console.log(data.similar_products)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productDetails: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  increment = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderSuccessItemData = () => {
    const {productDetails, similarProductsData, quantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    console.log(productDetails)
    return (
      <>
        <Header />
        <div className="product-item-section">
          <div className="product-item-card">
            <img src={imageUrl} className="product-image" alt="product" />
            <div className="product-details-card">
              <h1 className="product-title">{title}</h1>
              <p className="product-price">Rs {price}/-</p>
              <div className="rading-reviwes-container">
                <div className="product-rating">
                  <p className="rating-text">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    className="star-img"
                    alt="star"
                  />
                </div>
                <p className="review">{totalReviews}</p>
              </div>
              <p className="product-description">{description}</p>
              <p className="review">
                <span className="lable-text">Available: </span>
                {availability}
              </p>
              <p className="review">
                <span className="lable-text">Brand: </span>
                {brand}
              </p>
              <hr />
              <div className="quantity-holder">
                <button
                  type="button"
                  className="btn"
                  data-testid="minus"
                  onClick={this.decrement}
                >
                  <BsDashSquare className="btn-icons" />
                </button>
                <p className="number">{quantity}</p>
                <button
                  type="button"
                  className="btn"
                  data-testid="plus"
                  onClick={this.increment}
                >
                  <BsPlusSquare className="btn-icons" />
                </button>
              </div>
              <button type="button" className="add-btn">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-list">
            {similarProductsData.map(eachItem => (
              <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderComtent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessItemData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderComtent()}</>
  }
}

export default ProductItemDetails
